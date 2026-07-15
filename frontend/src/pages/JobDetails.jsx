import React from "react";
import { useNavigate } from "react-router-dom";
const job = {
  id: 1,

  title: "Full Stack Web Developer",

  company: "360 Marketing Agency",

  companyDescription:
    "360 Marketing Agency is a digital agency specialized in web development, e-commerce, ERP systems, AI solutions and digital marketing.",

  location: "Casablanca",

  workMode: "Remote / Hybrid",

  contractType: "Full Time",

  salary: "15 000 - 20 000 MAD",

  experience: "2+ Years",

  education: "Bachelor or Master Degree",

  publishedAt: "10 July 2026",

  applicationDeadline: "31 July 2026",

  description:
    "We are looking for a talented Full Stack Web Developer to join our team and work on websites, e-commerce platforms, marketplaces, ERP systems, custom business solutions and AI-powered applications.",

  responsibilities: [
    "Develop modern web applications.",
    "Build REST APIs.",
    "Work with React and Node.js.",
    "Optimize application performance.",
    "Collaborate with designers and project managers.",
    "Maintain existing applications."
  ],

  requirements: [
    "React.js",
    "Node.js",
    "Express.js",
    "MySQL",
    "Git",
    "REST API",
    "Docker",
    "Tailwind CSS"
  ],

  benefits: [
    "Remote work",
    "Flexible schedule",
    "Health insurance",
    "Annual bonus",
    "Paid training",
    "Modern equipment"
  ]
};





export default function JobDetails() {
    const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-10">

          <h1 className="text-4xl font-bold">
            {job.title}
          </h1>

          <h2 className="text-xl mt-2 opacity-90">
            {job.company}
          </h2>

          <div className="flex flex-wrap gap-3 mt-6">

            <span className="bg-white/20 px-4 py-2 rounded-full">
                📍 {job.location}
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-full">
                🏠 {job.workMode}
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-full">
                💼 {job.contractType}
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-full">
                💰 {job.salary}
            </span>

          </div>

        </div>


        <div className="grid lg:grid-cols-3">

          {/* LEFT */}

          <div className="lg:col-span-2 p-8 space-y-10">

            <section>

              <h2 className="text-2xl font-bold mb-4">
                Company
              </h2>

              <p className="text-gray-600 leading-8">
                {job.companyDescription}
              </p>

            </section>



            <section>

              <h2 className="text-2xl font-bold mb-4">
                Job Description
              </h2>

              <p className="text-gray-600 leading-8">
                {job.description}
              </p>

            </section>



            <section>

              <h2 className="text-2xl font-bold mb-4">
                Responsibilities
              </h2>

              <ul className="space-y-3 list-disc ml-6">

                {job.responsibilities.map((item,index)=>(

                  <li
                    key={index}
                    className="text-gray-600"
                  >
                    {item}
                  </li>

                ))}

              </ul>

            </section>



            <section>

              <h2 className="text-2xl font-bold mb-4">
                Requirements
              </h2>

              <div className="flex flex-wrap gap-3">

                {job.requirements.map((skill)=>(

                  <span
                    key={skill}
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            </section>



            <section>

              <h2 className="text-2xl font-bold mb-4">
                Benefits
              </h2>

              <ul className="space-y-3 list-disc ml-6">

                {job.benefits.map((item,index)=>(

                  <li
                    key={index}
                    className="text-gray-600"
                  >
                    {item}
                  </li>

                ))}

              </ul>

            </section>

          </div>


          {/* RIGHT */}

          <div className="bg-gray-50 border-l p-8">

            <div className="bg-white rounded-xl shadow p-6 space-y-5">

              <h2 className="text-xl font-bold">
                Job Overview
              </h2>


              <div>

                <p className="text-sm text-gray-500">
                  Experience
                </p>

                <p className="font-semibold">
                  {job.experience}
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Education
                </p>

                <p className="font-semibold">
                  {job.education}
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Published
                </p>

                <p className="font-semibold">
                  {job.publishedAt}
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Deadline
                </p>

                <p className="font-semibold">
                  {job.applicationDeadline}
                </p>

              </div>



              <button  onClick={() => navigate("/condidat-form")}
                className="
                w-full
                bg-indigo-600
                hover:bg-indigo-700
                transition
                text-white
                py-4
                rounded-xl
                font-bold
                "
              >

                Apply Now

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
 