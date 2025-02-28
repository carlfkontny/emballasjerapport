import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/DatePicker";

export default function RegistrerMengder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
          Registrer Mengder
        </h1>

        <div className="mt-6 space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100">
              Velg tidsperiode
            </h2>
            <DatePickerWithRange className="w-full" />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100">
              Hva vil du registrere?
            </h2>
            <RadioGroup defaultValue="Matbeholdere">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Matbeholdere" id="Matbeholdere" />
                  <label
                    htmlFor="Matbeholdere"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Matbeholdere
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Drikkebegre" id="Drikkebegre" />
                  <label
                    htmlFor="Drikkebegre"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Drikkebegre
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100">
              Hva er de laget av?
            </h2>
            <RadioGroup defaultValue="Helt av plast">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Helt av plast" id="Helt av plast" />
                  <label
                    htmlFor="Helt av plast"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Helt av plast
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Delvis av plast"
                    id="Delvis av plast"
                  />
                  <label
                    htmlFor="Delvis av plast"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Delvis av plast
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/." className="w-36">
            <Button className="w-full">Lagre</Button>
          </Link>
          <Link to="/." className="w-36">
            <Button variant="destructive" className="w-full">
              Avbryt
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
