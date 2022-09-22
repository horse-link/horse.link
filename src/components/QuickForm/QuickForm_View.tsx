import { Form, Formik } from "formik";
import React from "react";

import Button from "../Button/Button_View";
import Loader from "../Loader/Loader_View";

type Props<T> = {
  initialValues: T;
  onSubmit(data: T): void | Promise<void>;
  validationSchema?: any;
  error: string | string[] | undefined;
  children: React.ReactNode;
  buttonTitle: string;
  disableButton?: boolean;
  formClassName?: string;
  disabled?: boolean;
  validateOnMount?: boolean;
  enableReinitialize?: boolean;
};

const QuickForm = <T extends Record<string, unknown>>(props: Props<T>) => {
  return (
    <Formik<T>
      initialValues={props.initialValues}
      onSubmit={data => props.onSubmit(data)}
      validateOnChange={true}
      validateOnMount={props.validateOnMount}
      enableReinitialize={props.enableReinitialize}
      validationSchema={props.validationSchema}
    >
      {({ isSubmitting, isValid }) => {
        return (
          <Form className={props.formClassName}>
            {props.children}
            {props.error && (
              <div className="flex rounded-xl bg-yellow-50 p-2 mb-6">
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">
                    {props.error}
                  </h4>
                </div>
              </div>
            )}
            {isSubmitting ? (
              <div className=" flex justify-center">
                <Loader className="text-lg " />
              </div>
            ) : (
              <Button
                type="submit"
                className="text-white font-semibold blue-background w-full"
                loading={isSubmitting}
                disabled={!isValid || props.disableButton}
              >
                {" "}
                {props.buttonTitle}
              </Button>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default QuickForm;
