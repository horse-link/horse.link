import { Formik, Form } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "..";

type Props<T> = {
  initialValues: T;
  onSubmit(data: T): void | Promise<void>;
  validator(data: T): Partial<{ [key in keyof T]: string }>;
  error: string | undefined;
  children: React.ReactNode;
  buttonTitle: string;
  disableButton?: boolean;
  formClassName?: string;
  disabled?: boolean;
};

const QuickForm = <T extends {}>(props: Props<T>) => {
  return (
    <Formik<T>
      initialValues={props.initialValues}
      validate={props.validator}
      onSubmit={data => props.onSubmit(data)}
      validateOnChange={true}
    >
      {({ isSubmitting }) => (
        <Form className={props.formClassName}>
          {props.children}
          {props.error && (
            <div className="flex rounded-md bg-yellow-50 p-4 mb-6">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="h-5 w-5 text-yellow-400"
              />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  {props.error}
                </h3>
              </div>
            </div>
          )}

          <Button
            title={props.buttonTitle}
            type="submit"
            loading={isSubmitting}
            disabled={props.disabled}
          />
        </Form>
      )}
    </Formik>
  );
};

export default QuickForm;
