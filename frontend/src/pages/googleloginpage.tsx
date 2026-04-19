import { useSearchParams } from "react-router"

export default function GoogleLogin() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  
  return (
    <>
      <div>
      <h1>Auth Callback</h1>
      <p>Code: {code}</p>
    </div>
    </>
  )
};
