import fr from "../messages/fr.json"
import en from "../messages/en.json"

type Messages = typeof fr

declare global {
  interface IntlMessages extends Messages {}
}
