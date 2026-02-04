type Props = {
  children: React.ReactNode;
};

const DocumentLayout = ({ children }: Props) => {
  return <div className="w-full bg-white rounded-2xl shadow p-8">{children}</div>;
};

export default DocumentLayout;
