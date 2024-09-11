export const ResJson = (message,data,httpCode)=>{
    const response = new Response(JSON.stringify({ message:message ?? '', data : data ?? null }), {
        status: httpCode ?? 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
}