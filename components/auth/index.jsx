import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "axios";
import { useDialog } from "components/dialog";
import Meta from "components/meta";
import Signin from "./signin";

const Dialog = dynamic(() => import("components/dialog"));

export default function Auth() {
  const { query } = useRouter();
  const timeoutRef = useRef();

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  useEffect(() => {
    if (query.verificationId) {
      (async () => {
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
      })();
    }

    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [query.verificationId]);

  return (
    <>
      <Meta title="Auth" index={false} />
      <Signin />
      {dialog && <Dialog dialog={dialog} onClose={handleCloseDialog} />}
    </>
  );
}
