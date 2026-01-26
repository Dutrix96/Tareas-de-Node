import { GoogleLogin } from "@react-oauth/google";
import { apiLoginGoogle } from "../api/auth.js";

export default function LoginGoogle({ onLoginOk }) {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const id_token = credentialResponse.credential;

          const data = await apiLoginGoogle(id_token);

          if (!data?.ok) {
            console.error("Login Google fallo:", data);
            return;
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          onLoginOk?.(data);
        } catch (e) {
          console.error("Error login Google:", e);
        }
      }}
      onError={() => console.error("Error login Google")}
    />
  );
}