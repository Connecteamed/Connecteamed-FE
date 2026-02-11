type Props = {
  children: React.ReactNode;
};

const DocumentLayout = ({ children }: Props) => {
  return (
    <div className="w-full overflow-visible rounded-2xl bg-white p-8 pb-16 shadow">{children}</div>
  );
};

export default DocumentLayout;
