import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Bucket } from "../config.ts";

export async function getUploadToken(
  fileName: string,
  fileType: string,
  expireIn: number,
) {
  const command = new PutObjectCommand({
    Bucket: "Inquesta",
    Key: `uploads/${fileName}`,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3Bucket, command, {
    expiresIn: expireIn,
  });
  return signedUrl;
}
