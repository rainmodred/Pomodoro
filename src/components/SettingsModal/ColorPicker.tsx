import { Color, defaultColors } from '../../constants';

import styles from './ColorPicker.module.css';

interface Props {
  selectedColor: Color;
  onColorChange: (color: Color) => void;
}

export default function ColorPicker({ selectedColor, onColorChange }: Props) {
  return (
    <div className={styles.colors}>
      <span className={styles.subHeading}>Color</span>
      <div className={styles.colorsInputs} role="radiogroup">
        {defaultColors.map(({ name, hex }) => (
          <label className={styles.radio} key={name} data-testid={hex}>
            <span className={styles.radioInput}>
              <input
                type="radio"
                name="color"
                value={hex}
                checked={name === selectedColor.name}
                onChange={() => onColorChange({ name, hex } as Color)}
              />
              <span
                className={styles.radioControl}
                style={{ backgroundColor: hex }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-check"
                  width="18"
                  height="16"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="#171931"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l5 5l10 -10" />
                </svg>
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
