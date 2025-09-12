import { useRef } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { NewInsight } from "../../schemas/insight.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  addInsight: (insight: NewInsight) => void;
};

export const AddInsight = ({ addInsight , ...props }: AddInsightProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const formAction = (formData: FormData) => {
    if (!formRef.current) return;

    const newInsight = NewInsight.safeParse({
      brandId: Number(formData.get("brand")),
      text: String(formData.get("text")),
    });

    if (!newInsight.success) {
      // TODO: Show form validation errors
      return;
    }

    addInsight(newInsight.data);
    props.onClose();
  }

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form ref={formRef} className={styles.form} action={formAction}>
        <label className={styles.field} htmlFor="brand">
          Associated brand
          <select className={styles["field-input"]} name="brand" id="brand" defaultValue="">
            {BRANDS.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
        <label className={styles.field} htmlFor="text">
          Insight
          <textarea
            id="text"
            name="text"
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
          />
        </label>
        <Button className={styles.submit} type="submit" label="Add insight" data-testid="add-insight-submit" />
      </form>
    </Modal>
  );
};
