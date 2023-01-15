import axios from "axios";
import Dialog, { useDialog } from "components/dialog";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Signin from "./signin";

export default function Auth() {
  const { query } = useRouter();
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
            "<strong>Verified successfully!</strong><p>You can start using your account</p>",
            "success"
          );
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            handleCloseDialog();
          }, 3000);
        } catch (err) {
          // console.error(err?.response?.data || err?.error || err);
          handleOpenDialog(err?.response?.data || err?.error || err, "error");
        }
      }

      verifyEmail();
    }
  }, [query.verificationId]);

  return (
    <>
      <Signin />
      <Dialog dialog={dialog} onClose={handleCloseDialog} />
    </>
  );
}
