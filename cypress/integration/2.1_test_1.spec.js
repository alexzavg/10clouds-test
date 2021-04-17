import {
   URLs,
   els,
   creds,
   buttons_text,
   product_names,
   buyer_info,
   order_completion_info
} from '../support/app-data';

describe('First test', function() {

   it('should purchase Sauce Labs Backpack as a standard user', function() {
   
      cy.visit('/');
   
      cy.login(creds.username, creds.password);

      cy.url()
         .should('contain', URLs.inventory);

      cy.get(els.first_product_add_to_cart_button)
         .contains(buttons_text.ADD_TO_CART);
      cy.get(els.first_product_add_to_cart_button)
         .click()
         .contains(buttons_text.REMOVE);
   
      cy.get(els.shopping_cart_badge)
         .contains('1');

      cy.get(els.shopping_cart_icon)
         .click();
      
      cy.url()
         .should('contain', URLs.cart);

      cy.get(els.cart_item)
         .contains(product_names.sauce_labs_backpack);

      cy.get(els.checkout_button)
         .contains(buttons_text.CHECKOUT)
         .click();

      cy.url()
         .should('contain', URLs.checkout_step_one);

      cy.get(els.first_name)
         .click()
         .clear()
         .type(buyer_info.first_name);

      cy.get(els.last_name)
         .click()
         .clear()
         .type(buyer_info.last_name);

      cy.get(els.postal_code)
         .click()
         .clear()
         .type(buyer_info.postal_code);
      
      cy.get(els.continue_button)
         .click();
      
      cy.get(els.checkout_summary_container)
         .children()
         .should('contain', product_names.sauce_labs_backpack)
         .and('contain', buyer_info.payment_info)
         .and('contain', buyer_info.shipping_info);

      cy.get(els.finish_button)
         .contains(buttons_text.FINISH)
         .click();
      
      cy.contains(order_completion_info.thank_you);
      cy.contains(order_completion_info.order_dispatched);

      cy.get(els.menu_button)
         .click();

      cy.get(els.reset_app_state)
         .click();
 });

});
