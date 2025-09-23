import { ImForward3 } from 'react-icons/im';

export default function TLDR({ title }: { title: string }) {
  return (
    <h3 className='flex items-center'>
      <ImForward3 />
      TL;DR — {title}
    </h3>
  );
}
