import { Session } from "next-auth";
import { supabase } from "src/utils/supabase";

export async function maybeUploadInvoice(
  sessionData?: Session | null,
  file?: File | undefined,
  venueTextId?: string
) {
  if (sessionData?.user?.id && file) {
    await supabase.storage
      .from(sessionData.user.id)
      .upload(`invoices/${venueTextId}.pdf`, file, {
        contentType: "application/pdf",
      })
      .then(console.log)
      .catch(console.warn);
  }
}

export async function maybeGetInvoiceFileNames(sessionData?: Session | null) {
  if (sessionData?.user?.id) {
    await supabase.storage
      .from(sessionData.user.id)
      .list("invoices")
      .then(console.log)
      .catch(console.warn);
  }
}
