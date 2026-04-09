// 'use server'
// import { getAccessToken } from "@/lib/cookies";
//  export async function completeStudentProfile(profileData:any) {
//   const access_token =await getAccessToken();
//     if (!access_token) {
//    throw new Error("No tokens found");
//   }
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/complete/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${access_token}`,
//       },
//       body: JSON.stringify({
//         role: '',
//         major: profileData.major,
//         academic_level: profileData.academicLevel,
//         skills: profileData.skills,
//         gpa: profileData.gpa,
//       }),
//     });

//     const data = await response.json();

  
// };