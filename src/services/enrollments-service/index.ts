import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { invalidDataError, notFoundError } from '@/errors';
import addressRepository, { CreateAddressParams } from '@/repositories/address-repository';
import enrollmentRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
import { badRequestError } from '@/errors/bad-request-error';

// TODO - Receber o CEP por parâmetro nesta função.
async function getAddressFromCEP(cep: string) {
  // FIXME: está com CEP fixo!
  // const result = await request.get(`${process.env.VIA_CEP_API}/37440000/json/`);
  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  const validCEP = await isValidBrZipCode(cep);

  if (validCEP === false || !result.data) {
    throw notFoundError();
  }

  if (result.data.erro === true) {
    return result.data;
  }

  // FIXME: não estamos interessados em todos os campos
  const { logradouro, complemento, bairro, localidade, uf } = result.data;

  const data = { logradouro, complemento, bairro, cidade: localidade, uf };

  return data;
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw notFoundError();

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  const address = getAddressForUpsert(params.address);

  // TODO - Verificar se o CEP é válido antes de associar ao enrollment.

  const validCEP = await getAddressFromCEP(address.cep);

  if (validCEP.erro === true) {
    throw badRequestError();
  }

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

async function isValidBrZipCode(cep: string) {
  const regex = /^\d{5}-?\d{3}$/;
  const validateCep = regex.test(cep);
  return validateCep;
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};

export default enrollmentsService;
