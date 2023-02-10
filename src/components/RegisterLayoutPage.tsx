type Props = {
  children: React.ReactNode;
};

export const RegisterLayoutPage: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-w-screen min-h-screen bg-emerald-500 py-4">
      <main>
        <div className="max-w-9xl mx-auto px-4 pt-1 sm:px-6 lg:grid lg:px-9">
          <div className="lg:col-span-4">{children}</div>
        </div>
      </main>
    </div>
  );
};
