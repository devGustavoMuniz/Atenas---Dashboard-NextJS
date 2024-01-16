import { addUser } from "../../../lib/actions";
import styles from "../../../ui/dashboard/users/addUser/addUser.module.css";

const AddUserPage = () => {
  return (
    <div className={styles.container}>
      <form action={addUser} className={styles.form}>
        <input type="text" placeholder="Nome" name="username" required />
        <input type="email" placeholder="Email" name="email" required />
        <input
          type="password"
          placeholder="Senha"
          name="password"
          required
        />
        <input type="phone" placeholder="Telefone" name="phone" />
        <select name="isAdmin" id="isAdmin">
          <option value={false}>
            É Admin?
          </option>
          <option value={true}>Sim</option>
          <option value={false}>Não</option>
        </select>
        <select name="isActive" id="isActive">
          <option value={true}>
            Está Ativo?
          </option>
          <option value={true}>Sim</option>
          <option value={false}>Não</option>
        </select>
        <textarea
          name="address"
          id="address"
          rows="14"
          placeholder="Endereço"
        ></textarea>
        <button type="submit">Adicionar Usuário</button>
      </form>
    </div>
  );
};

export default AddUserPage;
