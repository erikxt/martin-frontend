import http from "./http";


const ApiService = {
  getSrt(id: string) {
    return http.get("/srt/" + id);
  },
  uploadVideo(file: any) {
    const formData = new FormData();
    formData.append("file", file);
    return http.post("/uploadfile", formData, {headers: {
      "Content-Type": "multipart/form-data",
    }});
  }
};

export default ApiService;
