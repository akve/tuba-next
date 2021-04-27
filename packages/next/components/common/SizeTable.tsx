import * as i18n from '@pdeals/next/utils/i18n';
const SizeTable = () => {
  return (
    <table className="table table-condensed table-sizes">
      <tbody>
        <tr>
          <th>{i18n.t('[R:Размер][U:Розмір]')}</th>
          <td>S</td>
          <td>M</td>
          <td>L</td>
          <td>XL</td>
          <td>2XL</td>
          <td>3XL</td>
          <td>4XL</td>
          <td>5XL</td>
        </tr>
        <tr>
          <th>{i18n.t('[R:Размер украинский][U:Розмір український]')}</th>
          <td>44</td>
          <td>46</td>
          <td>48</td>
          <td>50</td>
          <td>52</td>
          <td>54</td>
          <td>56</td>
          <td>58</td>
        </tr>
        <tr>
          <th>{i18n.t('[R:Обхват груди (см)][U:Обхват грудей (см)]')}</th>
          <td>86</td>
          <td>92</td>
          <td>98</td>
          <td>104</td>
          <td>110</td>
          <td>116</td>
          <td>122</td>
          <td>128</td>
        </tr>
        <tr>
          <th>{i18n.t('[R:Обхват талии (см)][U:Обхват талії (см)]')}</th>
          <td>68</td>
          <td>74</td>
          <td>80</td>
          <td>86</td>
          <td>92</td>
          <td>98</td>
          <td>106</td>
          <td>112</td>
        </tr>
        <tr>
          <th>{i18n.t('[R:Обхват бедер (см)][U:Обхват стеген (см)]')}</th>
          <td>92</td>
          <td>98</td>
          <td>106</td>
          <td>112</td>
          <td>118</td>
          <td>124</td>
          <td>130</td>
          <td>136</td>
        </tr>
      </tbody>
    </table>
  );
};

export { SizeTable };
