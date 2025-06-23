import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据文件路径
const DATA_DIR = path.join(__dirname, '../../data');
const GENE_NCRNA_MAP_FILE = path.join(DATA_DIR, 'gene_ncRNA_map.json');
const HSA_MTI_CSV_FILE = path.join(__dirname, '../../../hsa_MTI.csv');

let geneNcRNAMap = null;
let hsaMTIData = null;

// 初始化数据
async function initializeData() {
  try {
    if (!fs.existsSync(GENE_NCRNA_MAP_FILE)) {
      console.warn('ncRNA数据文件不存在，请先运行数据下载脚本');
      return false;
    }

    const data = fs.readFileSync(GENE_NCRNA_MAP_FILE, 'utf8');
    geneNcRNAMap = JSON.parse(data);
    console.log(`已加载 ${Object.keys(geneNcRNAMap).length} 个基因的ncRNA数据`);
    return true;
  } catch (error) {
    console.error('初始化ncRNA数据失败:', error);
    return false;
  }
}

// 查询基因相关的ncRNA
export async function queryNcRNA(gene, type) {
  // 如果数据未初始化，尝试初始化
  if (!geneNcRNAMap) {
    const initialized = await initializeData();
    if (!initialized) {
      throw new Error('ncRNA数据未初始化');
    }
  }

  const geneData = geneNcRNAMap[gene];
  if (!geneData) {
    return [];
  }

  let results = [];

  if (type === 'all') {
    // 返回所有类型的ncRNA
    ['miRNA', 'lncRNA', 'circRNA'].forEach(ncType => {
      if (geneData[ncType]) {
        results = results.concat(geneData[ncType]);
      }
    });
  } else {
    // 返回指定类型的ncRNA
    if (geneData[type]) {
      results = geneData[type];
    }
  }

  return results;
}

// 获取数据库统计信息
export async function getDataStats() {
  if (!geneNcRNAMap) {
    const initialized = await initializeData();
    if (!initialized) {
      throw new Error('ncRNA数据未初始化');
    }
  }

  const stats = {
    totalGenes: Object.keys(geneNcRNAMap).length,
    miRNACount: 0,
    lncRNACount: 0,
    circRNACount: 0
  };

  Object.values(geneNcRNAMap).forEach(geneData => {
    if (geneData.miRNA) stats.miRNACount += geneData.miRNA.length;
    if (geneData.lncRNA) stats.lncRNACount += geneData.lncRNA.length;
    if (geneData.circRNA) stats.circRNACount += geneData.circRNA.length;
  });

  return stats;
}

// 初始化CSV数据
async function initializeCSVData() {
  try {
    if (!fs.existsSync(HSA_MTI_CSV_FILE)) {
      console.warn(`hsa_MTI.csv文件不存在: ${HSA_MTI_CSV_FILE}`);
      return false;
    }

    console.log(`正在读取CSV文件: ${HSA_MTI_CSV_FILE}`);
    const data = fs.readFileSync(HSA_MTI_CSV_FILE, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      console.warn('CSV文件为空');
      return false;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    console.log('CSV文件头:', headers);

    hsaMTIData = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // 简单的CSV解析，假设没有引号内的逗号
      const values = line.split(',').map(v => v.trim());

      if (values.length >= 4) { // 至少需要前4个字段
        const record = {
          'miRTarBase ID': values[0] || '',
          'miRNA': values[1] || '',
          'Species (miRNA)': values[2] || '',
          'Target Gene': values[3] || '',
          'Target Gene (Entrez ID)': values[4] || '',
          'Species (Target Gene)': values[5] || '',
          'Experiments': values[6] || '',
          'Support Type': values[7] || '',
          'References (PMID)': values[8] || ''
        };
        hsaMTIData.push(record);
      }
    }

    console.log(`已加载 ${hsaMTIData.length} 条miRNA-Target数据`);

    // 显示前几条数据用于调试
    if (hsaMTIData.length > 0) {
      console.log('示例数据:', hsaMTIData.slice(0, 2));
    }

    return true;
  } catch (error) {
    console.error('初始化CSV数据失败:', error);
    return false;
  }
}

// 解析CSV行（处理引号内的逗号）
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// 查询基因相关的miRNA（从CSV文件）
export async function queryMiRNAFromCSV(targetGene) {
  // 如果CSV数据未初始化，尝试初始化
  if (!hsaMTIData) {
    const initialized = await initializeCSVData();
    if (!initialized) {
      throw new Error('CSV数据未初始化');
    }
  }

  const results = hsaMTIData.filter(record =>
    record['Target Gene'] &&
    record['Target Gene'].toUpperCase() === targetGene.toUpperCase()
  );

  // 转换为统一格式
  return results.map(record => ({
    id: record['miRNA'] || '',
    type: 'miRNA',
    evidence: record['Support Type'] || '',
    experiments: record['Experiments'] || '',
    pmid: record['References (PMID)'] || '',
    link: `https://www.mirbase.org/cgi-bin/mirna_entry.pl?acc=${record['miRNA'] || ''}`,
    miRTarBaseID: record['miRTarBase ID'] || ''
  }));
}

// 启动时初始化数据
initializeData();
initializeCSVData();
