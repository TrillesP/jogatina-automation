/// <reference types="cypress" />

describe('automação jogatina homepage após login', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('homePage'))
        cy.get('.header__btn-login').click()
        cy.get('#email-login').type(Cypress.env('email'))
        cy.get('#senha-login').type(Cypress.env('password'))
        cy.get('#loginform > .btn').click()    //entra na welcome page do site
    })

    it('verifica informações de login sendo mostradas corretamente', () => {
        //1a opção
        cy.get('.header__subnav-info-email').should('not.be.visible')
        cy.get('.header__subnav--profile')
            .invoke('css', 'overflow', 'visible')   // troco o valor do CSS overflow para "visible"
            .should('have.css', 'overflow', 'visible')
        cy.get('.header__nav-item--profile').within((avatar) => {
            cy.wrap(avatar).find('.header__subnav-info-email').should('be.visible').and('have.text', Cypress.env('email'))
          })
        // verifica se aparece o menu do usuário dando `wrap` no elemento com troca do `overflow` no CSS
        // também verifica se o e-mail aparece corretamente
        // - não funciona em todo site, por isso fiz um método com `realHover` também

        //2a opção
        cy.get('.header__subnav--profile')
            .invoke('css', 'overflow', 'hidden')
            .should('have.css', 'overflow', 'hidden')   // volto o CSS overflow para o valor inicial de "hidden"

        cy.get('.avatar').realHover('mouse').then(() => {
            cy.get('.header__subnav-info-email').should('be.visible').and('have.text', Cypress.env('email'))
            // verifica funcionalidade do avatar com 'mouseover' e se o e-mail correto aparece
            // `realHover` foi importado em '../support/e2e.js' e é baseada no Chrome
            // não funciona em Firefox e outros browsers que não são chrome-based
            // por isso fiz também a verificação acima como outra opção

            // ela também apresentou um problema nesse caso envolvendo o atributo `overflow` do CSS
            // diversas vezes o teste passava sem problemas e em outras não passava
            // por isso optei pela primeira opção preferencialmente
        })
    })

    it('testa clicar para jogar buraco fechado e alterar status do usuário de "Disponível" para "Invisível"', () => {
        cy.visit(Cypress.env('buracoFechado'))
        cy.get('.btn-amarelo').should('be.visible')
        cy.get('.btn-amarelo').click()
        
        cy.url().should('include', 'BURACO_FECHADO')
        cy.get('.Select--single').should('not.have.class', 'is-open')
        cy.get('#react-select-2--value-item').should('have.text', 'Disponível')
        // verifica se o valor inicial é "Disponível"
        cy.get('.Select--single').click()
        cy.get('.Select--single').should('have.class', 'is-open')
        // verifica se a classe do elemento muda para mostrar as outras opções de estado do usuário
        
        cy.get('.Select-input')
            .invoke('attr', 'aria-activedescendant')
            .should('eq', 'react-select-2--option-0')
        cy.contains('Invisível').realHover('mouse')
        cy.get('.Select-input')
            .invoke('attr', 'aria-activedescendant')
            .should('eq', 'react-select-2--option-2')
            // verifica se ao passar o mouse por cima de outros estados do usuário
            // se o valor em `aria-activedescendant` muda para que a cor de seleção mude
        cy.contains('Invisível').click()
        cy.get('#react-select-2--value-item').should('have.text', 'Invisível')
        // verifica se o estado do usuário mudou corretamente no display
    })

    it('testa clicar para jogar um jogo mobile e verifica se as informações batem', () => {
        cy.contains('clicando aqui').click()  //clica na opção de um jogo mobile

        cy.get(Cypress.env('image01'))
            .isFixtureImg("instalador-jogatina-win-1.png");
        cy.get(Cypress.env('image02'))
            .isFixtureImg("instalador-jogatina-win-2.png");
        // verifica se duas das imagens da explicação de como instalar os jogos mobile renderizam corretamente
        // aqui foi usada a mesma função criada para o teste 01
        // a função se encontra no path `cypress/support/commands.js`
        
    })

    it('verifica funcionalidade do botão "Ver meu Perfil" do menu de usuário', () => {
        cy.get('.avatar').realHover('mouse')
        cy.get('.header__subnav-info-nickname').should('be.visible').and('have.text', Cypress.env('nickname'))
        cy.contains('Ver meu Perfil').click({force: true})

        cy.url().should('include', '/perfil')   //verifica se foi redirecionado corretamente
        cy.get('.apelido').should('exist').and('have.text', Cypress.env('nickname'))   //verifica se o apelido aparece corretamente
        // o teste acima deveria funcionar, mas apresenta um erro que foi encontrado pelo Cypress
        // na própria aplicação do site Jogatina.com

        // The following error originated from your application code, not from Cypress.
        // > Cannot set properties of undefined (setting 'disclaimer')
        // When Cypress detects uncaught errors originating from your application it will automatically fail the current test.
    })

})