import Image from "next/image";

export default function ClientSection() {
  return (
    <section
      id="clients"
      className="text-center mx-auto max-w-[80rem] px-6 md:px-8"
    >
      <div className="py-14">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="text-center text-sm font-semibold text-gray-600">
            POWERED BY
          </h2>
          <div className="mt-6">
            <ul className="flex flex-wrap items-center justify-center gap-20">
              <li>
                <Image
                  src={`/mars-dark-bg.png`}
                  alt="Mars"
                  width={150}
                  height={150}
                />
              </li>
              <li>
                <Image
                  src={`/Neutron-Logo-light.png`}
                  alt="Neutron"
                  width={100}
                  height={100}
                />
              </li>
              <li>
                <Image
                  src={`/astroport-dark-bg.png`}
                  alt="Astroport"
                  width={150}
                  height={150}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
