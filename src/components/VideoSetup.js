'use client'

import { useState, useEffect } from 'react'
import { Settings, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function VideoSetup() {
    const [stream, setStream] = useState(null)
    const [devicesOff, setDevicesOff] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [stream])

    const handleDeviceToggle = async (checked) => {
        setDevicesOff(checked)
        setError(null)

        if (!checked) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })
                setStream(mediaStream)
            } catch (err) {
                console.error('Error accessing media devices:', err)
                setError('Unable to access camera and microphone. Please ensure you have granted the necessary permissions.')
                setDevicesOff(true)
            }
        } else if (checked && stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }

    const handleJoinMeeting = () => {
        console.log('Joining meeting with devices:', devicesOff ? 'off' : 'on')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1b1e] text-white p-4">
            <div className="w-full max-w-2xl space-y-6">
                <h1 className="text-2xl font-semibold text-center">Setup</h1>

                <div className="relative border-2 border-blue-500 rounded-lg aspect-video bg-[#1e2126] flex items-center justify-center">
                    {stream && !devicesOff ? (
                        <video
                            autoPlay
                            muted
                            ref={(videoElement) => {
                                if (videoElement) {
                                    videoElement.srcObject = stream
                                }
                            }}
                            className="w-full h-full rounded-lg"
                        />
                    ) : (
                        <div className="text-gray-400">Video is disabled</div>
                    )}
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="devices"
                            checked={devicesOff}
                            onCheckedChange={handleDeviceToggle}
                        />
                        <label
                            htmlFor="devices"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Join with mic and camera off
                        </label>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>

                <Button
                    onClick={handleJoinMeeting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                    Join meeting
                </Button>
            </div>
        </div>
    )
}

