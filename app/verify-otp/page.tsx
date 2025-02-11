'use client';

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";

export default function VerifyOTPPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-[400px] space-y-6 rounded-lg p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Enter Verification Code</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a verification code to your email
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <InputOTP maxLength={6} className="gap-2 flex justify-center">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button className="w-full" type="submit">
            Verify Code →
          </Button>

          <div className="space-y-2 text-center text-sm">
            <div>
              <Link href="/forgot-password" className="text-primary hover:underline">
                Didn&apos;t receive code? Send again
              </Link>
            </div>
            <div>
              <Link href="/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 