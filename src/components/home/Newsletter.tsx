import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const { register, handleSubmit, reset } = useForm<{ email: string }>();

  const onSubmit = (data: { email: string }) => {
    toast.success('Thank you for subscribing!');
    reset();
  };

  return (
    <section className="rounded-2xl bg-slate-900 p-8 text-center text-white sm:p-16">
      <div className="mx-auto max-w-md space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Stay in the Loop</h2>
        <p className="text-sm text-slate-400">Subscribe to get exclusive early access to drops, sales, and corporate news.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            required
            {...register('email')}
            className="w-full rounded-md bg-slate-800 px-4 py-3 text-sm text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
          />
          <button type="submit" className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}