## ChaosNet - A Partial Equalibrium Simulation on World Trade Data

To explore ChaosNet, we simulate a global trade environment taking a [Partial Equalibrium](https://en.wikipedia.org/wiki/Partial_equilibrium) approach and conjoining it with a [Knowledge Graph](https://en.wikipedia.org/wiki/Knowledge_graph) to expose global trade relations.

ChaosNet invokes a simulated environment where Nodes in the network represent Countries, Industries and the relations between them. This includes tariffs, world trade policies, export and import policies, and more. Through simulating a change in any of these factors, we can generate an expected probability of what ripple effects may occur at a global economic scale.

What we find most interesting is not what we expect the outcome to be, but what Nodes end up in our line of sight as we change a couple input parameters (i.e., increasing a tarrif in Chile on agricultural exports by .1% to USA). This then allows us to model what relations are affected by this change at a global scale.

Let us first define some variables.

$$
let =  \left\{
\begin{array}{l}
M_{c} = \text{Total import value for country } c \\
X_{c} = \text{Total export value for country } c \\
M_{cp} = \text{Total import value of product } p \text{ in country } c \\
X_{cp} = \text{Total export value of product } p \text{ in country } c \\
T_{cp} = \text{Original tariff rate on product } p \\
\Delta T_{cp} = \text{Change in tariff rate for product p}\\
B_{c} = \text{Trade balance for country c}\\
R_{cp} = \text{Tariff revenue from product p before tariff change}\\
R_{cp}^{\text{new}} = \text{Tariff revenue from product p after tariff change}
\end{array}
\right.
$$

<br>
Let us define a sequence of formulas for simulating how a change in an import tariff on a product affects the global economy for country p:
<br><br>
New Tariff Rate:

$$T_{cp}^{\text{new}} = T_{cp} + \Delta T_{cp}$$

Adjusted import value for product $p$ after tariff change:

$$M_{cp}^{\text{new}} = M_{cp} \cdot \left(1 - \frac{\Delta T_{cp}}{1 + T_{cp}}\right)$$

Here we expect a change in a tariff to affect the import value proportionally. A positive increase will reduce the import value, and a negative tariff value will increase it.

New total imports for country c adjusting for product p:

$$M_{cp}^{\text{new}} = M_{c} - \left(M_{cp} - M_{cp}^{\text{new}}\right)$$

Original Trade Balance:

$$B_{c} = X_{c} - M_{c}$$

Updated Trade Balance:

$$B_{c}^{\text{new}} = X_{c} - M_{c}^{\text{new}}$$

Change in Trade Balance (difference of export to import):

$$\Delta B_{c} = B_{c}^{\text{new}} - B_{c} = \left(X_{c} - M_{c}^{\text{new}} \right) - \left(X_{c} - M_{c}\right) = M_{c} - M_{c}^{\text{new}}$$

A positive change in Trade Balance indicates an improvement in the trade balance, while negative represents a defecit.

Original Tariff Revenue from product p:

$$R_{cp} = T_{cp} \cdot M_{cp}$$

New Tariff Revenue from Product p:

$$R_{cp}^{\text{new}} = T_{cp}^{\text{new}} \cdot M_{cp}^{\text{new}}$$

Change in Tariff Revenue from product p:

$$\Delta R_{cp} = R_{cp}^{\text{new}} - R_{cp}$$

Total Tariff Revenue change for country c:

$$\Delta R_{c} = \Delta R_{cp}$$
$$\Delta R_{c} = \sum_{p} \Delta R_{cp}$$

Through this, we can simulate for all countries how a change in an import tariff will affect the import values of specific products, and see a direct correlation to countries trade balances and total revenue shift.

Through this, we can simulate for all countries how a change in an import tariff will affect country $p$'s trade relations with the greater economy. We can then derive how the exporting countries economy adjusts to this tariff increase and measure their response. Lets explore.

$Note$: We will not be deriving the math for all the countless other simulations we are able to run, but this can be further expressed in exporting goods, importing multiple-goods, importing between multiple countries simultaneously, changing trade policies, political policies, multi-tariff changes and more.

Simulating these scenarios are important because it allows us to model just how the greater economy operates and to what measures countries take when trade policies adjust.

ChaosNet explores multiple responses from the exporting countries when an import tariff is increased. These include:

<ul>
1. Tariff Retaliation<br>
2. Looking else-where to make global trades<br>
3. Currency Inflation to offset tariff increases
</ul>

Lets outline a formula for calculating the Tariff Retaliation:

$$R_{\Delta} = \alpha \cdot T_{\Delta}$$
Here countries express $ R\_{\Delta}$ as the change in retaliatory tariff rate by multipying a factor of $\alpha$ to the change in the initial tariff rate.

Calculate the impact on export value:

$$X^{\text{new}} = X_{\text{original}} \cdot \left(1 - \frac{R_{\Delta}}{1 R_{\text{original}}}\right)$$

Calculate Tariff Revenue change:

$$\Delta R = R_{\text{new}} \cdot X^{\text{new}} - R_{\text{original}} \cdot X_{\text{original}}$$

Elasticity of demand and supply:

$$M^{\text{new}} = M_{\text{original}} \cdot \left(1 - \epsilon_{d} \frac{T_{\Delta}}{1 + T_{\text{original}}} \right)$$

$$X^{\text{new}} = X_{\text{original}} \cdot \left(1 - \epsilon_{s} \frac{R_{\Delta}}{1 + R_{\text{original}}} \right)$$

Elasticity of demand/supply showcases how import and export values respond to tariff changes.
