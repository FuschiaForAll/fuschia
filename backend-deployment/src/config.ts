
if (!process.env.DOCKERHUB_USERNAME) {
  throw new Error("DOCKERHUB_USERNAME is missing");
}
if (!process.env.DOCKERHUB_PASSWORD) {
  throw new Error("DOCKERHUB_PASSWORD is missing");
}
export const DOCKERHUB_USERNAME=process.env.DOCKERHUB_USERNAME
export const DOCKERHUB_PASSWORD=process.env.DOCKERHUB_PASSWORD