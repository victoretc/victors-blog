+++
cover = 'images/third.jpg'
date = '2026-03-29T21:17:52+03:00'
draft = false
title = 'Automatic step logging in Selene'
translationKey = 'auto-logging-in-selene'
+++

[Selene](https://github.com/yashaka/selene) is a wonderful library that lets you write wonderful tests. Below is a recipe for automatic step logging in Selene.

## Building the fixture

```python
import pytest
import allure_commons
from selene import support, browser

@pytest.fixture(autouse=True)
def browser_management():
    browser.config._wait_decorator = support._logging.wait_with(
            context=allure_commons._allure.StepContext
        )
    yield
    browser.quit()
```

## Writing the test

```python
from selene.support.shared.jquery_style import s
from selene import browser

def test_login():
    browser.open("https://www.saucedemo.com/")
    s('[data-test="username"]').type("standard_user")
    s('[data-test="password"]').type("secret_sauce")
    s('[data-test="login-button"]').click()
```

## Running it

```bash
pytest --alluredir=allure-results
```

## Enjoying the result


![Allure report example](./result-image.png)

To be continued.
