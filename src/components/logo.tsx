import Image from 'next/image';

const Logo = () => {
  return (
    <Image
      src={'/meu-societario-logo.svg'}
      width={100}
      height={100}
      alt="Flowtec Logo"
      priority={true}
    />
  );
};

export default Logo;
