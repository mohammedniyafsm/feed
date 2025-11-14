"use client";

import { useEffect } from "react";
import axios from "axios";

export default  function Main() {
  useEffect(() => {
    const fe = async () => {
      try {
        const respo = await axios.post("http://localhost:3000/api/feedback", {
          category :  "COMMUNICATION", title:'wwwww', description :"wwwwww", anonymous : true,
        });
        console.log("✅ Response:", respo.data);
      } catch (error: any) {
        console.error("❌ Error:", error.response?.data || error.message);
      }
    };

    fe(); // ✅ You forgot to call the function
  }, []);

  return <div>Testing POST Request...</div>;
}
