import Button from "@/components/Button";

export const FullPageError = ({
  message,
  onRecover,
}: {
  message: string;
  onRecover?: () => void;
}) => (
  <div className="p-8 text-center">
    <p className="text-red-500 mb-4">{message}</p>
    {onRecover && <Button onClick={onRecover}>Retry</Button>}
  </div>
);
