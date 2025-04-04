import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ReactNode } from 'react';

export const Acknowledgement: React.FC<{
	text: ReactNode;
  isChecked: boolean;
  onChange: () => void;
}> = ({ text, isChecked, onChange }) => (
  <div className="w-full flex flex-col gap-2">
    <p className="text-start">{text}</p>
    <div className="flex flex-row gap-5 items-center">
      <button
        className={cn(
          "flex-1 flex flex-row items-center gap-3 justify-start py-3 px-4 border rounded opacity-50 font-medium text-lg",
          isChecked && "border-accent opacity-100"
        )}
        onClick={onChange}
      >
        <Image src="/tick.svg" alt="tick" width={24} height={24} />
        <span>I agree</span>
      </button>
    </div>
  </div>
);
