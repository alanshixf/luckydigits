import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <div className='flex flex-wrap place-content-center space-x-4 '>
      <p className='bg-cyan-500'>Hello, Lucky Digits</p>
      <Button
        color='primary'
        variant='ghost'
      >
        Click
      </Button>
    </div>
  );
}
