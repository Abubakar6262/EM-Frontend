import Image from "next/image";
import TeamImg from "@/assets/images/Hero.png";

export default function MissionSection() {
    return (
        <section className="max-w-6xl mx-auto py-16  grid md:grid-cols-2 gap-10 items-center">

            {/* Image */}
            <div>
                <Image
                    src={TeamImg}
                    alt="Our Team"
                    className="rounded-2xl shadow-lg w-full"
                    priority
                />
            </div>

            {/* Text */}
            <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    At EventFlow, we believe in connecting people through experiences.
                    Our platform helps organizers create impactful events and participants engage effortlessly.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    From small workshops to large conferences, we simplify event planning
                    and participation with modern tools and beautiful design.
                </p>
            </div>
        </section>
    );
}
