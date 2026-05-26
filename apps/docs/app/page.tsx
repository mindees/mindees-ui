import Link from 'next/link';

const basePath = process.env.DOCS_BASE_PATH ?? '';

export default function Home() {
  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <img
        src={`${basePath}/logo.png`}
        alt="MindeesUI"
        width={96}
        height={96}
        style={{ display: 'block', marginBottom: 24 }}
      />
      <h1 style={{ fontSize: 56, lineHeight: 1.1, margin: 0 }}>MindeesUI</h1>
      <p style={{ fontSize: 20, color: '#444', marginTop: 16 }}>
        Universal React Native CLI + Expo component library with a deterministic Layout Intelligence
        Layer.
      </p>
      <p style={{ marginTop: 24 }}>
        <Link href="/docs">Read the docs →</Link>
      </p>
    </main>
  );
}
