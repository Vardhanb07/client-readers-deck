import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Enter header</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target);
              const key = data.get("key");
              const value = data.get("value");
              localStorage.setItem(
                "header",
                JSON.stringify({ key: key, value: value }),
              );
              navigate("/dash");
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="key">Key</FieldLabel>
                <Input
                  id="key"
                  name="key"
                  type="text"
                  placeholder="Key"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="value">Value</FieldLabel>
                </div>
                <Input
                  id="value"
                  name="value"
                  type="text"
                  required
                  placeholder="Value"
                />
              </Field>
              <Field>
                <Button type="submit">Add</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
