"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home/index.html');
  }, [router]);

  return null;
}
