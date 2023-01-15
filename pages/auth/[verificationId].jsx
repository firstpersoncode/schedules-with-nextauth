import axios from "axios";
import Dialog, { useDialog } from "components/dialog";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function Verification() {
  const { query, push } = useRouter();
  const timeoutRef = useRef();

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

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
          // console.error(err?.response?.data || err?.error || err);
          handleOpenDialog(err?.response?.data || err?.error || err, "error");
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            push("/schedule");
          }, 3000);
        }
      }

      verifyEmail();
    }
  }, [query.verificationId]);

  return <Dialog dialog={dialog} onClose={handleCloseDialog} />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    context.res.writeHead(302, {
      Location: "/schedule",
    });
    context.res.end();
  }

  return {
    props: {},
  };
}
