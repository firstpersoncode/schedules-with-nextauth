import { Alert, Dialog } from "@mui/material";
import axios from "axios";
import { signOut, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Verification() {
  const { query, push } = useRouter();
  const timeoutRef = useRef();

  const [dialog, setDialog] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  function handleOpenDialog(message, severity) {
    setDialog((v) => ({ ...v, open: true, message, severity }));
  }

  function handleCloseDialog() {
    setDialog((v) => ({ ...v, open: false, message: "" }));
  }

  useEffect(() => {
    if (query.verificationId) {
      async function verifyEmail() {
        try {
          const res = await axios.get(
            `/api/auth/verification?verificationId=${query.verificationId}`
          );
          if (!res?.data?.message) throw res;
          handleOpenDialog(
            "<strong>Verified successfully!</strong><p>You'll be redirected back to login page.</p><a href='/auth/signin'>Or click this if nothing happen.</a>",
            "success"
          );
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            push("/auth/signin");
          }, 3000);
        } catch (err) {
          console.error(err?.response?.data || err?.error || err);
          handleOpenDialog(err?.response?.data || err?.error || err, "error");
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            push("/");
          }, 3000);
        }
      }

      verifyEmail();
    }
  }, [query.verificationId]);

  return (
    <Dialog open={dialog.open} onClose={handleCloseDialog}>
      <Alert severity={dialog.severity}>
        <div dangerouslySetInnerHTML={{ __html: dialog.message }} />
      </Alert>
    </Dialog>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   return {
//     props: {
//       session,
//     },
//   };
// }
