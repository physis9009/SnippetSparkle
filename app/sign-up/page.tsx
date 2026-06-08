import {SignUpForm} from '@/app/ui/signup-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Sign Up",
};

export default function SignUpPage() {
    return (
        <div className='fixed z-50 bg-blk-gr/50 inset-0 flex items-center justify-center'>
            <SignUpForm />
        </div>
    );
}