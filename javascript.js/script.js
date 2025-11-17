document.addEventListener('DOMContentLoaded', () => {
  // Scroll suave para seções
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerHeight = 70;
    const sectionPosition = section.offsetTop - headerHeight;

    window.scrollTo({
      top: sectionPosition,
      behavior: 'smooth'
    });
  };
  window.scrollToSection = scrollToSection;

  // Calcula idade a partir da data de nascimento
  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  // Exibe voluntários cadastrados
  const exibirVoluntarios = () => {
    const voluntarios = JSON.parse(localStorage.getItem('voluntarios') || '[]');
    const voluntContainer = document.getElementById('voluntariosContainer');
    if (!voluntContainer) return;

    if (voluntarios.length === 0) {
      voluntContainer.innerHTML = '<p>Nenhum voluntário cadastrado.</p>';
      return;
    }

    let html = '<table border="1" cellpadding="5" cellspacing="0" style="width: 100%;">';
    html += '<tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Idade</th><th>Disponibilidade</th><th>Área de Interesse</th><th>Experiência</th><th>Data de Cadastro</th></tr>';

    voluntarios.forEach(v => {
      html += `<tr>
        <td>${v.name}</td>
        <td>${v.email}</td>
        <td>${v.telefone}</td>
        <td>${v.idade}</td>
        <td>${v.disponibilidade}</td>
        <td>${v.areaInteresse}</td>
        <td>${v.experiencia}</td>
        <td>${v.dataCadastro}</td>
      </tr>`;
    });

    html += '</table>';
    voluntContainer.innerHTML = html;
  };
  window.exibirVoluntarios = exibirVoluntarios;

  // Lógica para formulário de voluntário
  const formVoluntario = document.getElementById('formulario-voluntario');
  if (formVoluntario) {
    formVoluntario.addEventListener('submit', (event) => {
      event.preventDefault();
      if (formVoluntario.dataset.submiting === 'true') return;
      formVoluntario.dataset.submiting = 'true';

      const nome = formVoluntario.nome.value.trim();
      const email = formVoluntario.email.value.trim();
      const telefone = formVoluntario.telefone.value.trim();
      const nascimento = formVoluntario.nascimento.value;
      const idade = calcularIdade(nascimento);

      if (!nome || !email || !telefone || !nascimento) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        formVoluntario.dataset.submiting = 'false';
        return;
      }

      const formData = {
        name: nome,
        email,
        telefone,
        idade: idade.toString(),
        disponibilidade: formVoluntario.disponibilidade.value.trim(),
        areaInteresse: formVoluntario.areaInteresse?.value.trim() || 'Não Informado',
        experiencia: formVoluntario.experiencia?.value.trim() || 'Não Informado',
        dataCadastro: new Date().toLocaleString()
      };

      const voluntarios = JSON.parse(localStorage.getItem('voluntarios') || '[]');
      voluntarios.push(formData);
      localStorage.setItem('voluntarios', JSON.stringify(voluntarios));

      const successMessage = document.getElementById('mensagem-sucesso');
      if (successMessage) {
        formVoluntario.style.display = 'none';
        successMessage.classList.add('show');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          successMessage.classList.remove('show');
          formVoluntario.style.display = 'block';
        }, 5000);
      }

      formVoluntario.reset();
      formVoluntario.dataset.submiting = 'false';
      exibirVoluntarios();
    });

    exibirVoluntarios();
  }

  // Lógica para formulário de contato
  const formContato = document.getElementById('contato-form');
  if (formContato) {
    formContato.addEventListener('submit', (event) => {
      event.preventDefault();

      const nome = formContato.nome.value.trim();
      const email = formContato.email.value.trim();
      const assunto = formContato.assunto.value.trim();
      const mensagem = formContato.mensagem.value.trim();

      if (!nome || !email || !assunto || mensagem.length < 10) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
      }

      const successMessage = document.getElementById('contato-mensagem-sucesso');
      if (successMessage) {
        formContato.style.display = 'none';
        successMessage.classList.add('show');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          successMessage.classList.remove('show');
          formContato.style.display = 'block';
        }, 5000);
      }

      formContato.reset();
    });
  }
});

// Função global para limpar voluntários
function limparTabela() {
  localStorage.removeItem('voluntarios');
  if (typeof window.exibirVoluntarios === 'function') {
    window.exibirVoluntarios();
  } else {
    const container = document.getElementById('voluntariosContainer');
    if (container) {
      container.innerHTML = '<p>Nenhum voluntário cadastrado ainda.</p>';
    }
  }
}