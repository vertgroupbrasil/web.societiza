import Image from 'next/image';

const LogoOrange = ({ className }: { className?: string }) => {
  return (
    <Image
      src={'/logo-orange.svg'}
      width={200}
      height={200}
      alt="Societiza Logo"
      priority={true}
      className={className}
    />
  );
};

export default LogoOrange;
