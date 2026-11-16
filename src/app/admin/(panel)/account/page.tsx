import { PasswordForm } from "@/components/admin/login-form";

export const metadata = { title: "Password" };

export default function AccountPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold text-ink">Password</h1>
      <p className="mt-2 text-slate">Change the password for your admin account.</p>
      <div className="card mt-8 p-6 sm:p-8">
        <PasswordForm />
      </div>
    </>
  );
}
