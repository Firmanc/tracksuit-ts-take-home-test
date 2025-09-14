import { useActionState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { NewInsight } from "../../schemas/insight.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  addInsight: (insight: NewInsight) => Promise<void>;
};

/**
 * A modal form to add a new insight.
 */
export const AddInsight = ({ addInsight , ...props }: AddInsightProps) => {
  const [error, submitAction] = useActionState(
    async (_: unknown, formData: FormData) => {
      const newInsight = NewInsight.safeParse({
        brandId: Number(formData.get("brand")),
        text: String(formData.get("text")),
      });

      if (newInsight.error) {
        return newInsight.error.toString();
      }
      
      await addInsight(newInsight.data);
      props.onClose();
    },
    null,
  );

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} action={submitAction}>
        <label className={styles.field} htmlFor="brand">
          Select brand
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
        {error && <p>{error}</p>}
        <Button className={styles.submit} type="submit" label="Add insight" data-testid="add-insight-submit" />
      </form>
    </Modal>
  );
};
