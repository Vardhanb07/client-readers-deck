import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";

export default function EditItem() {
  const navigate = useNavigate();
  return (
    <div
      className={
        "flex flex-col gap-6 w-screen h-screen justify-center items-center p-6"
      }
    >
      <div className="w-80">
        <Card>
          <CardHeader>
            <CardTitle>Add category</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.target);
                const name = data.get("name");
                // mutate this
                navigate("/dash");
              }}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" name="name" type="text" required />
                </Field>
                <Field>
                  <Button type="submit">Add</Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
