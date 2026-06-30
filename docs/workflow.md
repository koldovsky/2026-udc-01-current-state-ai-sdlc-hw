# Опис виконаних робіт

acceptance criteria фічі:
We are adding a feature - calculator MpG to L/100KM
Acceptance criteria:
1. The calculation works correctly for the test data: 20mpg=11.76L/100km; 30mpg=7.84L/100km; 40mpg=5.88L/100km; (reference mile is 1.60934km, reference gallon is 3.78541178 liters)
2. It is allowed to enter numbers (up to 2 decimal places).
3. It is impossible to enter/insert other characters except digits and comma or dot as a separator (minus is also impossible).
4. Do not show result of calculation on UI if entered zero.
5. The result must be displayed in large bold numbers (with rounding to 2 decimal places using the HALF_UP method).
6. Added unit-tests for calculation.

що робили в кожному режимі:
Plan
- переглянув, побачив що і в які файли буде додано.
- яким чином буде виконано Acceptance Criteria Mapping.
- перевірив наявніть генерації тестів як одного з кроків.
- відхилив, переписав Acceptance Criteria, заапрувив план.
Agent
- апрувнув додавання залежності на Jest + ts-jest.
- переглянув результат виконання.

що скоригували після рев'ю плану:
- додав зміни в Acceptance criteria: Дозволити крапку в якості валідного розділювача, додати unit-tests.