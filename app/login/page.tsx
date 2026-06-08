import LoginForm from '../ui/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Sign In",
};

export default function LoginPage() {
    return (
    <div className='fixed z-50 bg-blk-gr/50 inset-0 flex items-center justify-center'>
        <LoginForm />
    </div>
  );
}