import fr from "../messages/fr.json"
import en from "../messages/en.json"

type Messages = typeof fr & typeof en

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
